package com.academia.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.academia.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SuscripcionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Suscripcion.class);
        Suscripcion suscripcion1 = new Suscripcion();
        suscripcion1.setId(1L);
        Suscripcion suscripcion2 = new Suscripcion();
        suscripcion2.setId(suscripcion1.getId());
        assertThat(suscripcion1).isEqualTo(suscripcion2);
        suscripcion2.setId(2L);
        assertThat(suscripcion1).isNotEqualTo(suscripcion2);
        suscripcion1.setId(null);
        assertThat(suscripcion1).isNotEqualTo(suscripcion2);
    }
}
