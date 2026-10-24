package com.soni.assistant.reminders

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import com.soni.assistant.data.memory.Reminder
import com.soni.assistant.data.memory.ReminderStore

/** Programa los recordatorios con AlarmManager para que suenen aunque SONI esté cerrado. */
object ReminderScheduler {

    fun schedule(context: Context, reminder: Reminder) {
        val am = context.getSystemService(AlarmManager::class.java) ?: return
        val pending = pendingIntent(context, reminder)
        val exactAllowed = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || am.canScheduleExactAlarms()
        try {
            if (exactAllowed) {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, reminder.atMillis, pending)
            } else {
                // Sin permiso de alarma exacta suena con unos minutos de margen, pero suena.
                am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, reminder.atMillis, pending)
            }
        } catch (e: SecurityException) {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, reminder.atMillis, pending)
        }
    }

    fun cancel(context: Context, reminder: Reminder) {
        context.getSystemService(AlarmManager::class.java)?.cancel(pendingIntent(context, reminder))
    }

    /** Tras reiniciar el teléfono, Android borra las alarmas: se vuelven a programar. */
    fun rescheduleAll(context: Context) {
        ReminderStore.get(context).pending().forEach { schedule(context, it) }
    }

    private fun pendingIntent(context: Context, reminder: Reminder): PendingIntent {
        val intent = Intent(context, ReminderReceiver::class.java)
            .putExtra(ReminderReceiver.EXTRA_ID, reminder.id)
            .putExtra(ReminderReceiver.EXTRA_TEXT, reminder.text)
        return PendingIntent.getBroadcast(
            context,
            reminder.id,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }
}
