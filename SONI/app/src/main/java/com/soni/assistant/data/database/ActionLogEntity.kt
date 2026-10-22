package com.soni.assistant.data.database

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * Fila del registro de acciones. Sin texto de la orden ni de la respuesta: solo qué
 * herramienta se usó, cuándo, con qué riesgo y cómo terminó.
 */
@Entity(tableName = "action_log", indices = [Index("timestamp")])
data class ActionLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "timestamp") val timestampMillis: Long,
    @ColumnInfo(name = "tool_name") val toolName: String,
    @ColumnInfo(name = "action_label") val actionLabel: String,
    @ColumnInfo(name = "risk_level") val riskLevel: String,
    @ColumnInfo(name = "state") val state: String,
)
