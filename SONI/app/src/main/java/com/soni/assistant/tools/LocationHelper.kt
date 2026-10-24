package com.soni.assistant.tools

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Geocoder
import android.location.Location
import android.location.LocationManager
import androidx.core.content.ContextCompat
import java.util.Locale

/** Ubicación aproximada (ciudad) para el clima y preguntas «cerca de mí». Sin servicios de Google. */
object LocationHelper {

    fun hasPermission(context: Context): Boolean =
        ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) ==
            PackageManager.PERMISSION_GRANTED

    /** «Medellín, Antioquia, Colombia», o coordenadas si no se puede traducir a ciudad. Null si no hay ubicación. */
    @Suppress("DEPRECATION", "MissingPermission")
    fun describeCurrentPlace(context: Context): String? {
        if (!hasPermission(context)) return null
        val lm = context.getSystemService(LocationManager::class.java) ?: return null
        val location: Location = listOf(
            LocationManager.NETWORK_PROVIDER,
            LocationManager.PASSIVE_PROVIDER,
            LocationManager.GPS_PROVIDER,
        ).mapNotNull { provider -> runCatching { lm.getLastKnownLocation(provider) }.getOrNull() }
            .maxByOrNull { it.time } ?: return null

        val place = runCatching {
            if (!Geocoder.isPresent()) return@runCatching null
            Geocoder(context, Locale.forLanguageTag("es"))
                .getFromLocation(location.latitude, location.longitude, 1)
                ?.firstOrNull()
                ?.let { a -> listOfNotNull(a.locality ?: a.subAdminArea, a.adminArea, a.countryName).distinct().joinToString(", ") }
        }.getOrNull()

        return place?.takeIf { it.isNotBlank() }
            ?: "las coordenadas %.3f, %.3f".format(Locale.ROOT, location.latitude, location.longitude)
    }
}
