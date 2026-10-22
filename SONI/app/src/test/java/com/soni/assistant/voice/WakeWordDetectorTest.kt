package com.soni.assistant.voice

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class WakeWordDetectorTest {

    @Test
    fun detectsWakeWordWithEnoughConfidence() {
        assertTrue(WakeWordDetector.matches(listOf(RecognizedWord("soni", 0.95))))
        assertTrue(WakeWordDetector.matches(listOf(RecognizedWord("son", 0.8), RecognizedWord("soni", 0.7))))
    }

    @Test
    fun ignoresLowConfidenceAndSimilarWords() {
        assertFalse(WakeWordDetector.matches(listOf(RecognizedWord("soni", 0.4))))
        assertFalse(WakeWordDetector.matches(listOf(RecognizedWord("sonia", 1.0))))
        assertFalse(WakeWordDetector.matches(listOf(RecognizedWord("sonido", 1.0))))
        assertFalse(WakeWordDetector.matches(emptyList()))
    }

    @Test
    fun grammarIsClosedAndIncludesUnknown() {
        val grammar = WakeWordDetector.grammarJson
        assertTrue(grammar.startsWith("[\"soni\""))
        assertTrue(grammar.endsWith("\"[unk]\"]"))
        assertEquals(1, Regex("\"soni\"").findAll(grammar).count())
    }
}
