package com.soni.assistant.tools

import android.app.ActivityManager
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.Sensor
import android.hardware.SensorManager
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.media.AudioManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.BatteryManager
import android.os.Build
import android.os.Environment
import android.os.StatFs
import com.soni.assistant.core.Action
import com.soni.assistant.core.ActionResult
import com.soni.assistant.core.FailureReason
import com.soni.assistant.core.IntentPriority
import com.soni.assistant.core.IntentRule
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.core.SoniLocale
import com.soni.assistant.core.SoniTool

class DeviceTool(private val context: Context) : SoniTool {

    override val name: String = "dispositivo"
    override val description: String = "Consulta el estado del teléfono (batería, almacenamiento, temperatura, memoria, red) y controla la linterna y el volumen."
    override val requiredPermissions: List<String> = emptyList()
    override val riskLevel: RiskLevel = RiskLevel.LOW

    override val intentRules: List<IntentRule> = listOf(
        IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
            when {
                BATTERY_PATTERNS.any { it.containsMatchIn(text) } -> Action.GetBatteryInfo
                STORAGE_PATTERNS.any { it.containsMatchIn(text) } -> Action.GetStorageInfo
                DEVICE_PATTERNS.any { it.containsMatchIn(text) } -> Action.GetDeviceInfo
                TEMP_PATTERNS.any { it.containsMatchIn(text) } -> Action.GetAmbientTemperature
                TORCH_ON_PATTERNS.any { it.containsMatchIn(text) } -> Action.ToggleFlashlight(true)
                TORCH_OFF_PATTERNS.any { it.containsMatchIn(text) } -> Action.ToggleFlashlight(false)
                else -> parseVolumeQuery(text)
            }
        }
    )

    override fun canHandle(action: Action): Boolean = action is Action.GetBatteryInfo ||
        action is Action.GetStorageInfo ||
        action is Action.GetDeviceInfo ||
        action is Action.GetAmbientTemperature ||
        action is Action.ToggleFlashlight ||
        action is Action.SetVolume

    override suspend fun execute(action: Action): ActionResult = when (action) {
        Action.GetBatteryInfo -> getBatteryStatus()
        Action.GetStorageInfo -> getStorageAndMemoryStatus()
        Action.GetDeviceInfo -> getDeviceAndNetworkStatus()
        Action.GetAmbientTemperature -> getAmbientTemperatureStatus()
        is Action.ToggleFlashlight -> toggleFlashlight(action.enable)
        is Action.SetVolume -> setVolume(action.percent)
        else -> ActionResult.Failed("No puedo realizar esta acción.", FailureReason.NO_TOOL)
    }

    private fun getBatteryStatus(): ActionResult {
        val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        val batteryIntent = context.registerReceiver(null, filter)
            ?: return ActionResult.Failed("No se pudo obtener el estado de la batería.", FailureReason.UNEXPECTED)

        val level = batteryIntent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
        val scale = batteryIntent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
        val percent = if (level >= 0 && scale > 0) (level * 100) / scale else -1

        val status = batteryIntent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
        val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
            status == BatteryManager.BATTERY_STATUS_FULL

        val stateText = if (isCharging) "cargando" else "desconectada"

        val tempTenths = batteryIntent.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, -1)
        val tempC = if (tempTenths > 0) tempTenths / 10.0 else -1.0
        val tempFormatted = if (tempC > 0) CalculatorTool.formatNumber(tempC, SoniLocale.locale) else null

        val msg = "La batería está al $percent% ($stateText)." +
            if (tempFormatted != null) " La temperatura de la batería es de $tempFormatted °C." else ""

        return ActionResult.Success(
            message = msg,
            spokenMessage = "La batería está al $percent por ciento y está $stateText." +
                if (tempFormatted != null) " La batería está a $tempFormatted grados." else "",
            actionLabel = "Batería consultada",
        )
    }

    private fun getStorageAndMemoryStatus(): ActionResult {
        val path = Environment.getDataDirectory()
        val stat = StatFs(path.path)
        val freeBytes = stat.availableBlocksLong * stat.blockSizeLong
        val totalBytes = stat.blockCountLong * stat.blockSizeLong

        val freeGB = CalculatorTool.formatNumber(freeBytes / 1e9, SoniLocale.locale)
        val totalGB = CalculatorTool.formatNumber(totalBytes / 1e9, SoniLocale.locale)

        val am = context.getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager
        val memInfo = ActivityManager.MemoryInfo()
        am?.getMemoryInfo(memInfo)

        val ramFreeGB = if (am != null) CalculatorTool.formatNumber(memInfo.availMem / 1e9, SoniLocale.locale) else "?"
        val ramTotalGB = if (am != null) CalculatorTool.formatNumber(memInfo.totalMem / 1e9, SoniLocale.locale) else "?"

        val msg = "Almacenamiento: $freeGB GB libres de $totalGB GB. Memoria RAM: $ramFreeGB GB libres de $ramTotalGB GB."

        return ActionResult.Success(
            message = msg,
            spokenMessage = "Tienes $freeGB gigabytes libres de almacenamiento y $ramFreeGB gigabytes libres de memoria RAM.",
            actionLabel = "Almacenamiento consultado",
        )
    }

    private fun getDeviceAndNetworkStatus(): ActionResult {
        val model = Build.MODEL
        val manufacturer = Build.MANUFACTURER.replaceFirstChar { if (it.isLowerCase()) it.titlecase(SoniLocale.locale) else it.toString() }
        val androidVer = Build.VERSION.RELEASE
        val sdkInt = Build.VERSION.SDK_INT

        val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
        val network = cm?.activeNetwork
        val caps = cm?.getNetworkCapabilities(network)

        val netStatus = when {
            caps?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true -> "WiFi activa"
            caps?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true -> "Datos móviles activos"
            else -> "Sin conexión a internet"
        }

        val msg = "Dispositivo: $manufacturer $model con Android $androidVer (API $sdkInt). Red: $netStatus."

        return ActionResult.Success(
            message = msg,
            spokenMessage = "Tienes un $manufacturer $model con Android $androidVer. Estado de red: $netStatus.",
            actionLabel = "Dispositivo consultado",
        )
    }

    private fun getAmbientTemperatureStatus(): ActionResult {
        val sm = context.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
        val tempSensor = sm?.getDefaultSensor(Sensor.TYPE_AMBIENT_TEMPERATURE)

        if (tempSensor == null) {
            val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
            val batteryIntent = context.registerReceiver(null, filter)
            val tempTenths = batteryIntent?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, -1) ?: -1
            val tempC = if (tempTenths > 0) tempTenths / 10.0 else -1.0
            val tempFormatted = if (tempC > 0) CalculatorTool.formatNumber(tempC, SoniLocale.locale) else null

            val msg = "Este teléfono no incluye un sensor de temperatura ambiente interno. " +
                if (tempFormatted != null) "Sin embargo, la temperatura de la batería del dispositivo es de $tempFormatted °C."
                else "Tampoco fue posible leer la temperatura interna."

            val spoken = "Este modelo no tiene sensor de temperatura ambiente. " +
                if (tempFormatted != null) "La batería está a $tempFormatted grados centígrados."
                else "No pude medir la temperatura."

            return ActionResult.Success(
                message = msg,
                spokenMessage = spoken,
                actionLabel = "Temperatura consultada",
            )
        }

        return ActionResult.Success(
            message = "El teléfono cuenta con un sensor de ambiente. Puedes colocarlo en reposo para medir la temperatura ambiental.",
            actionLabel = "Sensor disponible",
        )
    }

    private fun toggleFlashlight(enable: Boolean): ActionResult {
        val cm = context.getSystemService(Context.CAMERA_SERVICE) as? CameraManager
            ?: return ActionResult.Failed("No se puede acceder a la cámara.", FailureReason.UNEXPECTED)

        return try {
            val cameraId = cm.cameraIdList.firstOrNull { id ->
                cm.getCameraCharacteristics(id).get(CameraCharacteristics.FLASH_INFO_AVAILABLE) == true
            } ?: return ActionResult.Failed("Este teléfono no tiene linterna de flash disponible.", FailureReason.NO_TOOL)

            cm.setTorchMode(cameraId, enable)
            val actionText = if (enable) "encendida" else "apagada"
            ActionResult.Success(
                message = "Linterna $actionText.",
                actionLabel = "Linterna $actionText",
            )
        } catch (e: Exception) {
            ActionResult.Failed("No pude cambiar el estado de la linterna.", FailureReason.UNEXPECTED)
        }
    }

    private fun setVolume(percent: Int): ActionResult {
        val clamped = percent.coerceIn(0, 100)
        val am = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
            ?: return ActionResult.Failed("No se puede acceder al control de audio.", FailureReason.UNEXPECTED)

        val maxVol = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
        val targetVol = (maxVol * clamped) / 100
        am.setStreamVolume(AudioManager.STREAM_MUSIC, targetVol, 0)

        return ActionResult.Success(
            message = "Volumen ajustado al $clamped%.",
            spokenMessage = "Ajusté el volumen al $clamped por ciento.",
            actionLabel = "Volumen ajustado",
        )
    }

    private companion object {
        val BATTERY_PATTERNS = listOf(
            Regex("\\b(?:bateria|nivel de bateria|carga|temperatura de la bateria)\\b"),
            Regex("\\bcuanta bateria\\b"),
        )
        val STORAGE_PATTERNS = listOf(
            Regex("\\b(?:almacenamiento|espacio libre|memoria|memoria ram|ram)\\b"),
            Regex("\\bcuanta memoria\\b"),
        )
        val DEVICE_PATTERNS = listOf(
            Regex("\\b(?:dispositivo|modelo del telefono|version de android|estado del telefono|info del telefono)\\b"),
        )
        val TEMP_PATTERNS = listOf(
            Regex("\\b(?:temperatura ambiente|temperatura del ambiente|sensor de temperatura)\\b"),
        )
        val TORCH_ON_PATTERNS = listOf(
            Regex("\\b(?:enciende|prende|activa|prender|encender)\\s+(?:la\\s+)?linterna\\b"),
            Regex("^linterna$"),
        )
        val TORCH_OFF_PATTERNS = listOf(
            Regex("\\b(?:apaga|desactiva|apagar|desactivar)\\s+(?:la\\s+)?linterna\\b"),
        )
        val VOLUME_PATTERN = Regex("\\bvolumen\\s+(?:al|en)?\\s*(\\d{1,3})%?\\b")

        fun parseVolumeQuery(text: String): Action? {
            val match = VOLUME_PATTERN.find(text)
            if (match != null) {
                val num = match.groupValues[1].toIntOrNull() ?: return null
                return Action.SetVolume(num)
            }
            if (text.contains("sube el volumen") || text.contains("sube volumen")) {
                return Action.SetVolume(80)
            }
            if (text.contains("baja el volumen") || text.contains("baja volumen")) {
                return Action.SetVolume(30)
            }
            return null
        }
    }
}
