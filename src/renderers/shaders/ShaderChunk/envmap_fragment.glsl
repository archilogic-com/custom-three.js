#ifdef USE_ENVMAP

	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )

		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );

		// Transforming Normal Vectors with the Inverse Transformation
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );

		#ifdef ENVMAP_MODE_REFLECTION

			vec3 reflectVec = reflect( cameraToVertex, worldNormal );

		#else

			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );

		#endif

	#else

		vec3 reflectVec = vReflect;

	#endif

	#ifdef USE_PARALLAX_CORRECTION
	    vec3 nrdir = normalize(reflectVec);
	    vec3 rbmax = (0.5 * (cubeSize - cubePos) - vWorldPosition) / nrdir;
	    vec3 rbmin = (-0.5 * (cubeSize - cubePos) - vWorldPosition) / nrdir;

	    vec3 rbminmax;
	    rbminmax.x = (nrdir.x > 0.0) ? rbmax.x : rbmin.x;
	    rbminmax.y = (nrdir.y > 0.0) ? rbmax.y : rbmin.y;
	    rbminmax.z = (nrdir.z > 0.0) ? rbmax.z : rbmin.z;
	    float correction = min(min(rbminmax.x, rbminmax.y), rbminmax.z);

	    vec3 intersection = vWorldPosition + nrdir * correction;
	    reflectVec = intersection - cubePos;
	#endif

	#ifdef DOUBLE_SIDED
		float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );
	#else
		float flipNormal = 1.0;
	#endif

	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );

	#elif defined( ENVMAP_TYPE_EQUIREC )
		vec2 sampleUV;
		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );
		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;
		vec4 envColor = texture2D( envMap, sampleUV );

	#elif defined( ENVMAP_TYPE_SPHERE )
		vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + vec3(0.0,0.0,1.0));
		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );
	#endif

	envColor.xyz = inputToLinear( envColor.xyz );

	#ifdef ENVMAP_BLENDING_MULTIPLY

		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );

	#elif defined( ENVMAP_BLENDING_MIX )

		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );

	#elif defined( ENVMAP_BLENDING_ADD )

		outgoingLight += envColor.xyz * specularStrength * reflectivity;

	#endif

#endif
