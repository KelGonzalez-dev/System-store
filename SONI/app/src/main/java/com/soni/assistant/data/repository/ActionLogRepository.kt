package com.soni.assistant.data.repository

import android.content.Context
import com.soni.assistant.core.ActionLogEntry
import com.soni.assistant.core.ActionLogger
import com.soni.assistant.core.ExecutionState
import com.soni.assistant.core.RiskLevel
import com.soni.assistant.data.database.ActionLogDao
import com.soni.assistant.data.database.ActionLogEntity
import com.soni.assistant.data.database.SoniDatabase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

/** Registro de acciones persistente, visible y borrable desde la app. */
class ActionLogRepository(private val dao: ActionLogDao) : ActionLogger {

    val recent: Flow<List<ActionLogEntry>> =
        dao.observeRecent(SHOWN_ENTRIES).map { rows -> rows.mapNotNull { it.toEntry() } }

    override suspend fun record(entry: ActionLogEntry) {
        dao.insert(
            ActionLogEntity(
                timestampMillis = entry.timestampMillis,
                toolName = entry.toolName,
                actionLabel = entry.actionLabel,
                riskLevel = entry.riskLevel.name,
                state = entry.state.name,
            )
        )
        dao.trimTo(MAX_ENTRIES)
    }

    suspend fun clear() = dao.clear()

    private fun ActionLogEntity.toEntry(): ActionLogEntry? {
        // Una fila con valores que esta versión no conoce se omite en vez de romper la pantalla.
        val risk = RiskLevel.entries.firstOrNull { it.name == riskLevel } ?: return null
        val executionState = ExecutionState.entries.firstOrNull { it.name == state } ?: return null
        return ActionLogEntry(timestampMillis, toolName, actionLabel, risk, executionState)
    }

    companion object {
        private const val MAX_ENTRIES = 500
        private const val SHOWN_ENTRIES = 200

        fun create(context: Context): ActionLogRepository =
            ActionLogRepository(SoniDatabase.get(context).actionLogDao())
    }
}
