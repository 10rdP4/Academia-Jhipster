package com.academia.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.academia.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AlumnoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Alumno.class);
        Alumno alumno1 = new Alumno();
        alumno1.setId(1L);
        Alumno alumno2 = new Alumno();
        alumno2.setId(alumno1.getId());
        assertThat(alumno1).isEqualTo(alumno2);
        alumno2.setId(2L);
        assertThat(alumno1).isNotEqualTo(alumno2);
        alumno1.setId(null);
        assertThat(alumno1).isNotEqualTo(alumno2);
    }
}
