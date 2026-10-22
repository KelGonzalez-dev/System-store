package com.soni.assistant.core

import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/** Pruebas de la Sub-fase 3.1: permisos, riesgo, confirmación y registro de acciones. */
class SoniEngineSafetyTest {

    /** Acción simulada solo para estas pruebas. */
    private data class Wipe(val target: String) : Action

    /** Herramienta de riesgo alto simulada: cuenta cuántas veces se ejecutó de verdad. */
    private class FakeTool(
        override val name: String,
        override val riskLevel: RiskLevel,
        override val requiredPermissions: List<String> = emptyList(),
        private val trigger: String,
    ) : SoniTool {
        var executions = 0
        override val description = "Herramienta de prueba"
        override val intentRules = listOf(
            IntentRule(IntentPriority.EXPLICIT_COMMAND) { text ->
                if (text.startsWith(trigger)) Wipe(text.removePrefix(trigger).trim()) else null
            },
        )

        override fun canHandle(action: Action) = action is Wipe
        override fun describe(action: Action) = "borrar «${(action as Wipe).target}»"
        override suspend fun execute(action: Action): ActionResult {
            executions++
            return ActionResult.Success("Borrado.", actionLabel = "Datos borrados")
        }
    }

    private class RecordingLogger : ActionLogger {
        val entries = mutableListOf<ActionLogEntry>()
        override suspend fun record(entry: ActionLogEntry) {
            entries += entry
        }
    }

    private var now = 1_000L
    private val logger = RecordingLogger()

    private fun engineWith(tool: SoniTool, missing: List<String> = emptyList()) = SoniEngine(
        registry = ToolRegistry(listOf(tool)),
        permissions = { requested -> requested.filter { it in missing } },
        logger = logger,
        clock = { now },
        confirmationTtlMs = 60_000,
    )

    @Test
    fun unaAccionDeRiesgoAltoExigeConfirmacionYNoSeEjecutaAntes() = runBlocking {
        val tool = FakeTool("borrador", RiskLevel.HIGH, trigger = "borra")
        val engine = engineWith(tool)

        val result = engine.process("SONI, borra las fotos")

        assertTrue(result is ActionResult.NeedsConfirmation)
        assertTrue(result.message.contains("borrar «las fotos»"))
        assertEquals(0, tool.executions)

        val confirmed = engine.confirm((result as ActionResult.NeedsConfirmation).confirmationId)
        assertTrue(confirmed is ActionResult.Success)
        assertEquals(1, tool.executions)
    }

    @Test
    fun unaConfirmacionSoloValeUnaVezYParaSuIdentificador() = runBlocking {
        val tool = FakeTool("borrador", RiskLevel.HIGH, trigger = "borra")
        val engine = engineWith(tool)
        val id = (engine.process("borra todo") as ActionResult.NeedsConfirmation).confirmationId

        val wrong = engine.confirm("otro-identificador")
        assertEquals(FailureReason.CONFIRMATION_EXPIRED, (wrong as ActionResult.Failed).reason)
        assertTrue(engine.confirm(id) is ActionResult.Success)
        assertTrue(engine.confirm(id) is ActionResult.Failed)
        assertEquals(1, tool.executions)
    }

    @Test
    fun unaConfirmacionCaducadaNoEjecuta() = runBlocking {
        val tool = FakeTool("borrador", RiskLevel.HIGH, trigger = "borra")
        val engine = engineWith(tool)
        val id = (engine.process("borra todo") as ActionResult.NeedsConfirmation).confirmationId

        now += 60_001
        val result = engine.confirm(id)

        assertEquals(FailureReason.CONFIRMATION_EXPIRED, (result as ActionResult.Failed).reason)
        assertEquals(0, tool.executions)
    }

    @Test
    fun cancelarNoEjecutaYQuedaRegistrado() = runBlocking {
        val tool = FakeTool("borrador", RiskLevel.HIGH, trigger = "borra")
        val engine = engineWith(tool)
        val id = (engine.process("borra todo") as ActionResult.NeedsConfirmation).confirmationId

        val result = engine.cancel(id)

        assertEquals(FailureReason.USER_CANCELLED, (result as ActionResult.Failed).reason)
        assertEquals(0, tool.executions)
        assertTrue(engine.confirm(id) is ActionResult.Failed)
        assertEquals(listOf(ExecutionState.NEEDS_CONFIRMATION, ExecutionState.FAILED), logger.entries.map { it.state })
    }

    @Test
    fun sinPermisoDevuelveNeedsPermissionYNoSeEjecuta() = runBlocking {
        val permission = "android.permission.READ_CONTACTS"
        val tool = FakeTool("contactos", RiskLevel.MEDIUM, listOf(permission), trigger = "borra")
        val engine = engineWith(tool, missing = listOf(permission))

        val result = engine.process("borra a Ana")

        assertTrue(result is ActionResult.NeedsPermission)
        assertEquals(listOf(permission), (result as ActionResult.NeedsPermission).permissions)
        assertTrue(result.message.contains("leer tus contactos"))
        assertEquals(0, tool.executions)
    }

    @Test
    fun elPermisoSeCompruebaAntesQueLaConfirmacion() = runBlocking {
        val permission = "android.permission.WRITE_CONTACTS"
        val tool = FakeTool("contactos", RiskLevel.HIGH, listOf(permission), trigger = "borra")
        val engine = engineWith(tool, missing = listOf(permission))

        assertTrue(engine.process("borra a Ana") is ActionResult.NeedsPermission)
        assertEquals(0, tool.executions)
    }

    @Test
    fun riesgoBajoSeEjecutaDirectoYElRegistroNoGuardaLaOrden() = runBlocking {
        val tool = FakeTool("borrador", RiskLevel.LOW, trigger = "borra")
        val engine = engineWith(tool)

        val result = engine.process("borra el número secreto 3001234567")

        assertTrue(result is ActionResult.Success)
        assertEquals(1, tool.executions)
        val entry = logger.entries.single()
        assertEquals("borrador", entry.toolName)
        assertEquals("Datos borrados", entry.actionLabel)
        assertEquals(ExecutionState.SUCCESS, entry.state)
        assertFalse(entry.toString().contains("3001234567"))
    }

    @Test
    fun lasReglasDeCadaHerramientaSeRespetanPorPrioridad() {
        val registry = ToolRegistry(SoniEngine.defaultTools())
        val parser = IntentParser(registry.intentRules())

        assertEquals(Action.TellTime, parser.parse("qué hora es"))
        assertTrue(parser.parse("cuánto es 2 más 2") is Action.Calculate)
        // Sin herramientas registradas, nada se reconoce salvo ayuda y saludo.
        val bare = IntentParser(emptyList())
        assertTrue(bare.parse("qué hora es") is Action.Unknown)
        assertEquals(Action.Help, bare.parse("ayuda"))
    }
}
