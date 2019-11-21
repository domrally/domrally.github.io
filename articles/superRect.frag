#ifdef GL_ES
precision mediump float;
#endif

// #extension GL_OES_standard_derivatives : enable

uniform vec2 u_resolution;


void main()
{    
    // render
    gl_FragColor.rg = gl_FragCoord.xy / u_resolution;
    gl_FragColor.b = 0.;
    gl_FragColor.a = 1.;// - gl_FragColor.a;
}