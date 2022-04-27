package com.academia.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.academia.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProfesorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Profesor.class);
        Profesor profesor1 = new Profesor();
        profesor1.setId(1L);
        Profesor profesor2 = new Profesor();
        profesor2.setId(profesor1.getId());
        assertThat(profesor1).isEqualTo(profesor2);
        profesor2.setId(2L);
        assertThat(profesor1).isNotEqualTo(profesor2);
        profesor1.setId(null);
        assertThat(profesor1).isNotEqualTo(profesor2);
    }
}
