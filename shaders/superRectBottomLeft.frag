#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
// 
float tanh(float t)
{
    float e = exp(2. * t);
    return (e - 1.) / (e + 1.);
}
// 
float atanh(float x)
{
    return .5 * log((1. + x) / (1. - x));
}
// 
const float k = 1.19228;
// 
float sinf(float t)
{
    float f = tanh(k * tan(t));
    f = mix(1., f, step(t, 1.5));
    return f;
}
// 
float asinf(float y)
{
    float f = atan(atanh(y) / k);
    return f;
}
// 
float cosf(float t)
{
    return tanh(k / tan(t));
}
// 
float acosf(float x)
{
    float f = atan(k / atanh(x));
    f = mix(f, 0., step(1., x));
    return f;
}
// 
vec4 getColor(float fill, float stroke)
{
    vec4 color;
    color.a = 1.;
    color.rgb = vec3(1.);
    color = mix(color, vec4(vec3(.67),1.), stroke);
    //color = mix(color, vec4(0.), fill);
    return color;
}

void main()
{    
    // set up the composition
    float scale = 1. / min(u_resolution.x, u_resolution.y);
    vec2 p = scale * (gl_FragCoord.xy - u_resolution.xy);
    // make sure it's always at least a certain size
    float r = 1. * scale;
    p *= 1. + r;
    // take advantage of symmetry
    p = abs(p);
    p = mix(p, p.yx, step(p.x, p.y));
    p.y = mix(p.y, .1, step(p.y, .1));
    // since the shape is convex we can be sure which points are inside
    float x = p.y - sinf(acosf(p.x));
    float y = p.x - cosf(asinf(p.y));
    float fill = 1. - step(.0, x) * step(.0, y);
    // distance field becomes assymptotically correct as points get close to curve
	float d = x * y * inversesqrt(x * x + y * y);
    float stroke = smoothstep(2. * r, 0., d);
    // render
    gl_FragColor = getColor(fill, stroke);
}