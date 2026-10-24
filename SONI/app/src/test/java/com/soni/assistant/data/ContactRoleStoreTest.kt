package com.soni.assistant.data

import com.soni.assistant.data.contacts.ContactRoleStore
import org.junit.Assert.assertEquals
import org.junit.Test

class ContactRoleStoreTest {

    @Test
    fun losRolesSeReconocenConSinonimosYSinEmojis() {
        assertEquals("mama", ContactRoleStore.canonicalRole("a mi Mamá"))
        assertEquals("mama", ContactRoleStore.canonicalRole("Madre ❤️"))
        assertEquals("mama", ContactRoleStore.canonicalRole("mami"))
        assertEquals("jefa", ContactRoleStore.canonicalRole("mi jefa"))
        assertEquals("juan perez", ContactRoleStore.canonicalRole("Juan Pérez 😎"))
    }
}
