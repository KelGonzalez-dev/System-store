package com.soni.assistant.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

/**
 * Base de datos local de SONI. Vive solo en el teléfono y no se incluye en copias de
 * seguridad (`allowBackup="false"` en el manifiesto).
 *
 * Al añadir entidades en fases siguientes, subir [version] y escribir su migración; el
 * esquema de cada versión se exporta a `app/schemas`.
 */
@Database(entities = [ActionLogEntity::class], version = 1, exportSchema = true)
abstract class SoniDatabase : RoomDatabase() {

    abstract fun actionLogDao(): ActionLogDao

    companion object {
        @Volatile
        private var instance: SoniDatabase? = null

        /** Una sola instancia por proceso: la comparten la pantalla y el servicio de voz. */
        fun get(context: Context): SoniDatabase = instance ?: synchronized(this) {
            instance ?: Room.databaseBuilder(context.applicationContext, SoniDatabase::class.java, "soni.db")
                .build()
                .also { instance = it }
        }
    }
}
