package com.soni.assistant.calls

import android.telecom.Call
import android.telecom.InCallService

/**
 * Permite a SONI contestar, colgar y rechazar llamadas por voz.
 *
 * Solo funciona si el usuario pone SONI como «app de teléfono» por defecto (lo pide la propia app).
 * Mientras no lo haga, SONI no interfiere con las llamadas en absoluto.
 */
@Suppress("unused")
class SoniCallService : InCallService() {

    override fun onCallAdded(call: Call) {
        current = call
        call.registerCallback(callback)
    }

    override fun onCallRemoved(call: Call) {
        call.unregisterCallback(callback)
        if (current == call) current = null
    }

    private val callback = object : Call.Callback() {
        override fun onStateChanged(call: Call, state: Int) {
            if (state == Call.STATE_DISCONNECTED) current = null
        }
    }

    companion object {
        @Volatile
        private var current: Call? = null

        val hasIncomingCall: Boolean get() = current?.state == Call.STATE_RINGING
        val hasActiveCall: Boolean get() = current?.let { it.state == Call.STATE_ACTIVE || it.state == Call.STATE_DIALING } == true
        val hasAnyCall: Boolean get() = current != null

        fun answer(): Boolean {
            val call = current ?: return false
            if (call.state != Call.STATE_RINGING) return false
            return runCatching { call.answer(android.telecom.VideoProfile.STATE_AUDIO_ONLY); true }.getOrDefault(false)
        }

        /** Cuelga la llamada activa o rechaza la entrante. */
        fun hangUp(): Boolean {
            val call = current ?: return false
            return runCatching {
                if (call.state == Call.STATE_RINGING) call.reject(false, null) else call.disconnect()
                true
            }.getOrDefault(false)
        }
    }
}
