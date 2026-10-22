package com.soni.assistant.data.database

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface ActionLogDao {

    @Insert
    suspend fun insert(entry: ActionLogEntity)

    @Query("SELECT * FROM action_log ORDER BY timestamp DESC, id DESC LIMIT :limit")
    fun observeRecent(limit: Int): Flow<List<ActionLogEntity>>

    /** Conserva solo las [keep] entradas más recientes. */
    @Query("DELETE FROM action_log WHERE id NOT IN (SELECT id FROM action_log ORDER BY timestamp DESC, id DESC LIMIT :keep)")
    suspend fun trimTo(keep: Int)

    @Query("DELETE FROM action_log")
    suspend fun clear()
}
