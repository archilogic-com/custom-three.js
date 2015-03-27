#ifdef USE_LIGHTMAP

    #ifndef USE_ENHANCED_LIGHTMAP
        outgoingLight *= diffuseColor.xyz * texture2D( lightMap, vUv2 ).xyz;

    #else
        // compute the light value
        vec4 unit = vec4(1.0);
        vec4 light = 2.0 * (texture2D(lightMap, vUv2) - lm_Center * unit);

        // compute the light intensity modifier
        vec4 modifier = - lm_Falloff * light * light + unit;

        // apply the lightmap
        outgoingLight *= diffuseColor.xyz * light * modifier * lm_Intensity;
    #endif
    
#endif
