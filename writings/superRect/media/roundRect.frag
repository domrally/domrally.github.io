#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}
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
    // since the shape is convex we can be sure which points are inside
    float d = sdBox(p, vec2(.5)) - .5;
    float fill = step(d, 0.);
    float stroke = smoothstep(r, r - 4. * scale, abs(d));
    // render
    gl_FragColor = getColor(fill, stroke);
}