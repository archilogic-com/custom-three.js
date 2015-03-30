#ifdef USE_LIGHTMAP

    #ifndef USE_ENHANCED_LIGHTMAP
        outgoingLight *= diffuseColor.xyz * texture2D( lightMap, vUv2 ).xyz;

    #else
        // compute the light value
        vec3 unit = vec3(1.0);
        vec3 light = 2.0 * (texture2D(lightMap, vUv2).xyz - lm_Center * unit);

        // compute the light intensity modifier
        vec3 modifier = - lm_Falloff * light * light + unit;

        // apply the lightmap
        // TODO: Investigate why this needs to be an addition instead of multiplication now
        outgoingLight += diffuseColor.xyz * light * modifier * lm_Intensity;
    #endif

#endif
