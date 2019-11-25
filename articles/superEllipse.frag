#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
// 
vec4 getColor(float fill, float stroke)
{
    vec4 color = vec4(1.);
    color.rgb = mix(color.rgb, vec3(1.), fill);
    color.rgb = mix(color.rgb, vec3(0.), stroke);
    return color;
}

void main()
{    
    // set up the composition
    float scale = 1. / min(u_resolution.x, u_resolution.y);
    vec2 p = scale * (2. * gl_FragCoord.xy - u_resolution.xy);
    // make sure it's always at least a certain size
    float r = max(16. * scale, .015);
    p *= 1. + r;
    // take advantage of symmetry
    p = abs(p);
    float exponent = 4.;
    float d = pow(pow(p.x, exponent) + pow(p.y, exponent), 1. / exponent) - 1.;
    float fill = step(d, .0);
    float stroke = smoothstep(r, r - 4. * scale, abs(d));
    // render
    gl_FragColor = getColor(fill, stroke);
}