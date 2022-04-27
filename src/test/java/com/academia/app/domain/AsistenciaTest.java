package com.academia.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.academia.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AsistenciaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Asistencia.class);
        Asistencia asistencia1 = new Asistencia();
        asistencia1.setId(1L);
        Asistencia asistencia2 = new Asistencia();
        asistencia2.setId(asistencia1.getId());
        assertThat(asistencia1).isEqualTo(asistencia2);
        asistencia2.setId(2L);
        assertThat(asistencia1).isNotEqualTo(asistencia2);
        asistencia1.setId(null);
        assertThat(asistencia1).isNotEqualTo(asistencia2);
    }
}
