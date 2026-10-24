package com.soni.assistant.tools

import java.util.Locale

class UnitConversionException(message: String) : Exception(message)

data class ConversionResult(
    val value: Double,
    val sourceUnitName: String,
    val targetUnitName: String,
    val note: String? = null,
)

internal enum class TempType { CELSIUS, FAHRENHEIT, KELVIN }

internal data class UnitSpec(val ratioToBase: Double, val displayName: String)

private val TEMP_MAP = mapOf(
    "celsius" to TempType.CELSIUS, "centigrados" to TempType.CELSIUS,
    "grados celsius" to TempType.CELSIUS, "grados centigrados" to TempType.CELSIUS,
    "c" to TempType.CELSIUS, "°c" to TempType.CELSIUS,
    "fahrenheit" to TempType.FAHRENHEIT, "grados fahrenheit" to TempType.FAHRENHEIT,
    "f" to TempType.FAHRENHEIT, "°f" to TempType.FAHRENHEIT,
    "kelvin" to TempType.KELVIN, "grados kelvin" to TempType.KELVIN, "k" to TempType.KELVIN,
)

private val LENGTH_UNITS = mapOf(
    "metro" to UnitSpec(1.0, "m"), "metros" to UnitSpec(1.0, "m"), "m" to UnitSpec(1.0, "m"),
    "kilometro" to UnitSpec(1000.0, "km"), "kilometros" to UnitSpec(1000.0, "km"), "km" to UnitSpec(1000.0, "km"),
    "centimetro" to UnitSpec(0.01, "cm"), "centimetros" to UnitSpec(0.01, "cm"), "cm" to UnitSpec(0.01, "cm"),
    "milimetro" to UnitSpec(0.001, "mm"), "milimetros" to UnitSpec(0.001, "mm"), "mm" to UnitSpec(0.001, "mm"),
    "milla" to UnitSpec(1609.344, "millas"), "millas" to UnitSpec(1609.344, "millas"), "mi" to UnitSpec(1609.344, "millas"),
    "yarda" to UnitSpec(0.9144, "yardas"), "yardas" to UnitSpec(0.9144, "yardas"), "yd" to UnitSpec(0.9144, "yardas"),
    "pie" to UnitSpec(0.3048, "pies"), "pies" to UnitSpec(0.3048, "pies"), "ft" to UnitSpec(0.3048, "pies"),
    "pulgada" to UnitSpec(0.0254, "pulgadas"), "pulgadas" to UnitSpec(0.0254, "pulgadas"), "in" to UnitSpec(0.0254, "pulgadas"),
)

private val WEIGHT_UNITS = mapOf(
    "gramo" to UnitSpec(1.0, "g"), "gramos" to UnitSpec(1.0, "g"), "g" to UnitSpec(1.0, "g"),
    "kilogramo" to UnitSpec(1000.0, "kg"), "kilogramos" to UnitSpec(1000.0, "kg"),
    "kilo" to UnitSpec(1000.0, "kg"), "kilos" to UnitSpec(1000.0, "kg"), "kg" to UnitSpec(1000.0, "kg"),
    "miligramo" to UnitSpec(0.001, "mg"), "miligramos" to UnitSpec(0.001, "mg"), "mg" to UnitSpec(0.001, "mg"),
    "libra" to UnitSpec(453.59237, "libras"), "libras" to UnitSpec(453.59237, "libras"), "lb" to UnitSpec(453.59237, "libras"),
    "onza" to UnitSpec(28.349523, "onzas"), "onzas" to UnitSpec(28.349523, "onzas"), "oz" to UnitSpec(28.349523, "onzas"),
    "tonelada" to UnitSpec(1000000.0, "toneladas"), "toneladas" to UnitSpec(1000000.0, "toneladas"), "t" to UnitSpec(1000000.0, "toneladas"),
)

private val TIME_UNITS = mapOf(
    "segundo" to UnitSpec(1.0, "s"), "segundos" to UnitSpec(1.0, "s"), "s" to UnitSpec(1.0, "s"),
    "minuto" to UnitSpec(60.0, "min"), "minutos" to UnitSpec(60.0, "min"), "min" to UnitSpec(60.0, "min"),
    "hora" to UnitSpec(3600.0, "h"), "horas" to UnitSpec(3600.0, "h"), "h" to UnitSpec(3600.0, "h"),
    "dia" to UnitSpec(86400.0, "días"), "dias" to UnitSpec(86400.0, "días"),
    "semana" to UnitSpec(604800.0, "semanas"), "semanas" to UnitSpec(604800.0, "semanas"),
    "ano" to UnitSpec(31536000.0, "años"), "anos" to UnitSpec(31536000.0, "años"),
)

private val DATA_UNITS = mapOf(
    "byte" to UnitSpec(1.0, "B"), "bytes" to UnitSpec(1.0, "B"), "b" to UnitSpec(1.0, "B"),
    "kilobyte" to UnitSpec(1024.0, "KB"), "kilobytes" to UnitSpec(1024.0, "KB"), "kb" to UnitSpec(1024.0, "KB"),
    "megabyte" to UnitSpec(1048576.0, "MB"), "megabytes" to UnitSpec(1048576.0, "MB"), "mb" to UnitSpec(1048576.0, "MB"),
    "gigabyte" to UnitSpec(1073741824.0, "GB"), "gigabytes" to UnitSpec(1073741824.0, "GB"), "gb" to UnitSpec(1073741824.0, "GB"),
    "terabyte" to UnitSpec(1099511627776.0, "TB"), "terabytes" to UnitSpec(1099511627776.0, "TB"), "tb" to UnitSpec(1099511627776.0, "TB"),
)

private val SPEED_UNITS = mapOf(
    "metros por segundo" to UnitSpec(1.0, "m/s"), "m/s" to UnitSpec(1.0, "m/s"),
    "kilometros por hora" to UnitSpec(1.0 / 3.6, "km/h"), "km/h" to UnitSpec(1.0 / 3.6, "km/h"), "kmh" to UnitSpec(1.0 / 3.6, "km/h"),
    "millas por hora" to UnitSpec(0.44704, "mph"), "mph" to UnitSpec(0.44704, "mph"),
    "nudo" to UnitSpec(0.514444, "nudos"), "nudos" to UnitSpec(0.514444, "nudos"),
)

private val CURRENCY_UNITS = mapOf(
    "dolar" to UnitSpec(1.0, "USD"), "dolares" to UnitSpec(1.0, "USD"), "usd" to UnitSpec(1.0, "USD"), "$" to UnitSpec(1.0, "USD"),
    "euro" to UnitSpec(1.08, "EUR"), "euros" to UnitSpec(1.08, "EUR"), "eur" to UnitSpec(1.08, "EUR"), "€" to UnitSpec(1.08, "EUR"),
    "peso colombiano" to UnitSpec(0.00025, "COP"), "pesos colombianos" to UnitSpec(0.00025, "COP"), "cop" to UnitSpec(0.00025, "COP"),
    "peso mexicano" to UnitSpec(0.055, "MXN"), "pesos mexicanos" to UnitSpec(0.055, "MXN"), "mxn" to UnitSpec(0.055, "MXN"),
    "peso argentino" to UnitSpec(0.00105, "ARS"), "pesos argentinos" to UnitSpec(0.00105, "ARS"), "ars" to UnitSpec(0.00105, "ARS"),
    "sol" to UnitSpec(0.27, "PEN"), "soles" to UnitSpec(0.27, "PEN"), "pen" to UnitSpec(0.27, "PEN"),
    "libra esterlina" to UnitSpec(1.28, "GBP"), "libras esterlinas" to UnitSpec(1.28, "GBP"), "gbp" to UnitSpec(1.28, "GBP"),
    "yen" to UnitSpec(0.0064, "JPY"), "yenes" to UnitSpec(0.0064, "JPY"), "jpy" to UnitSpec(0.0064, "JPY"),
)

/**
 * Conversor de unidades de física (longitud, peso, temperatura, tiempo, datos, velocidad)
 * y monedas con tasas de cambio base.
 */
class UnitConverter {

    fun convert(value: Double, sourceRaw: String, targetRaw: String): ConversionResult {
        val s = normalizeUnitName(sourceRaw)
        val t = normalizeUnitName(targetRaw)

        // 1. Temperatura
        val tempResult = tryTemperatureConvert(value, s, t)
        if (tempResult != null) return tempResult

        // 2. Longitud
        val lengthResult = tryLinearConvert(value, s, t, LENGTH_UNITS, "metros")
        if (lengthResult != null) return lengthResult

        // 3. Peso / Masa
        val weightResult = tryLinearConvert(value, s, t, WEIGHT_UNITS, "gramos")
        if (weightResult != null) return weightResult

        // 4. Tiempo
        val timeResult = tryLinearConvert(value, s, t, TIME_UNITS, "segundos")
        if (timeResult != null) return timeResult

        // 5. Datos
        val dataResult = tryLinearConvert(value, s, t, DATA_UNITS, "bytes")
        if (dataResult != null) return dataResult

        // 6. Velocidad
        val speedResult = tryLinearConvert(value, s, t, SPEED_UNITS, "metros por segundo")
        if (speedResult != null) return speedResult

        // 7. Monedas
        val currencyResult = tryLinearConvert(value, s, t, CURRENCY_UNITS, "USD")
        if (currencyResult != null) {
            return currencyResult.copy(note = "Tasa de cambio de referencia")
        }

        throw UnitConversionException("No sé cómo convertir de «$sourceRaw» a «$targetRaw».")
    }

    private fun tryTemperatureConvert(value: Double, source: String, target: String): ConversionResult? {
        val sType = TEMP_MAP[source] ?: return null
        val tType = TEMP_MAP[target] ?: return null

        // Convert source to Celsius first
        val celsius = when (sType) {
            TempType.CELSIUS -> value
            TempType.FAHRENHEIT -> (value - 32.0) * 5.0 / 9.0
            TempType.KELVIN -> value - 273.15
        }

        // Convert Celsius to target
        val converted = when (tType) {
            TempType.CELSIUS -> celsius
            TempType.FAHRENHEIT -> (celsius * 9.0 / 5.0) + 32.0
            TempType.KELVIN -> celsius + 273.15
        }

        val sName = when (sType) {
            TempType.CELSIUS -> "°C"
            TempType.FAHRENHEIT -> "°F"
            TempType.KELVIN -> "K"
        }
        val tName = when (tType) {
            TempType.CELSIUS -> "°C"
            TempType.FAHRENHEIT -> "°F"
            TempType.KELVIN -> "K"
        }

        return ConversionResult(converted, sName, tName)
    }

    private fun tryLinearConvert(
        value: Double,
        source: String,
        target: String,
        units: Map<String, UnitSpec>,
        categoryName: String,
    ): ConversionResult? {
        val sSpec = units[source] ?: return null
        val tSpec = units[target] ?: return null

        val baseValue = value * sSpec.ratioToBase
        val converted = baseValue / tSpec.ratioToBase

        return ConversionResult(converted, sSpec.displayName, tSpec.displayName)
    }

    private fun normalizeUnitName(raw: String): String {
        return raw.lowercase(Locale.ROOT)
            .trim()
            .replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ú", "u")
            .replace("ñ", "n")
    }
}
