package com.soni.assistant.core

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat

/** Dice qué permisos de una lista faltan. Separado de Android para poder probar el motor. */
fun interface PermissionChecker {
    fun missing(permissions: List<String>): List<String>
}

/** Comprobación real contra los permisos concedidos en el teléfono. */
class PermissionManager(context: Context) : PermissionChecker {

    private val appContext = context.applicationContext

    override fun missing(permissions: List<String>): List<String> = permissions.filter {
        ContextCompat.checkSelfPermission(appContext, it) != PackageManager.PERMISSION_GRANTED
    }

    companion object {
        /** Nombre comprensible de cada permiso, para explicar al usuario qué se pide y por qué. */
        fun label(permission: String): String = when (permission) {
            Manifest.permission.RECORD_AUDIO -> "micrófono"
            Manifest.permission.READ_CONTACTS -> "leer tus contactos"
            Manifest.permission.WRITE_CONTACTS -> "modificar tus contactos"
            Manifest.permission.CALL_PHONE -> "hacer llamadas"
            Manifest.permission.SEND_SMS -> "enviar SMS"
            Manifest.permission.CAMERA -> "cámara"
            Manifest.permission.ACCESS_FINE_LOCATION -> "ubicación precisa"
            Manifest.permission.ACCESS_COARSE_LOCATION -> "ubicación aproximada"
            Manifest.permission.POST_NOTIFICATIONS -> "mostrar notificaciones"
            else -> permission.substringAfterLast('.').lowercase().replace('_', ' ')
        }
    }
}
