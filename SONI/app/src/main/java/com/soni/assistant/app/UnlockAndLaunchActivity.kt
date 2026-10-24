package com.soni.assistant.app

import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import androidx.fragment.app.FragmentActivity
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat

/**
 * Pantalla invisible que, con el teléfono bloqueado, pide la huella (o rostro/PIN) y, al
 * desbloquear, abre la app pedida. SONI nunca guarda ni escribe tu PIN: solo lanza el
 * desbloqueo del sistema, igual que cuando desbloqueas tú.
 */
class UnlockAndLaunchActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Mostrar sobre la pantalla de bloqueo.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        }

        val target = intent.getStringExtra(EXTRA_PACKAGE)
        if (target.isNullOrBlank()) { finish(); return }

        val keyguard = getSystemService(KeyguardManager::class.java)
        if (keyguard?.isKeyguardLocked != true) {
            launchAndClose(target)
            return
        }
        promptUnlock(target)
    }

    private fun promptUnlock(targetPackage: String) {
        val can = BiometricManager.from(this).canAuthenticate(
            BiometricManager.Authenticators.BIOMETRIC_WEAK or BiometricManager.Authenticators.DEVICE_CREDENTIAL
        )
        if (can != BiometricManager.BIOMETRIC_SUCCESS) {
            // Sin huella configurada: al menos se pide desbloquear a mano.
            requestDeviceUnlock(targetPackage)
            return
        }
        val prompt = BiometricPrompt(this, ContextCompat.getMainExecutor(this),
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    launchAndClose(targetPackage)
                }

                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    finish()
                }
            })
        val info = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Desbloquea para abrir")
            .setSubtitle("SONI quiere abrir una app")
            .setAllowedAuthenticators(
                BiometricManager.Authenticators.BIOMETRIC_WEAK or BiometricManager.Authenticators.DEVICE_CREDENTIAL
            )
            .build()
        runCatching { prompt.authenticate(info) }.onFailure { finish() }
    }

    private fun requestDeviceUnlock(targetPackage: String) {
        val keyguard = getSystemService(KeyguardManager::class.java)
        keyguard?.requestDismissKeyguard(this, object : KeyguardManager.KeyguardDismissCallback() {
            override fun onDismissSucceeded() { launchAndClose(targetPackage) }
            override fun onDismissError() { finish() }
            override fun onDismissCancelled() { finish() }
        }) ?: finish()
    }

    private fun launchAndClose(targetPackage: String) {
        val launch = packageManager.getLaunchIntentForPackage(targetPackage)
            ?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        if (launch != null) runCatching { startActivity(launch) }
        finish()
    }

    companion object {
        private const val EXTRA_PACKAGE = "target_package"

        fun isDeviceLocked(context: Context): Boolean =
            context.getSystemService(KeyguardManager::class.java)?.isKeyguardLocked == true

        /** Abre [packageName] pasando primero por el desbloqueo del sistema. */
        fun launch(context: Context, packageName: String) {
            val intent = Intent(context, UnlockAndLaunchActivity::class.java)
                .putExtra(EXTRA_PACKAGE, packageName)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            runCatching { context.startActivity(intent) }
        }
    }
}
