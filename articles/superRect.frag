#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

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
    return .5 * log((x + 1.) / (x - 1.));
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
// gets rid of the jaggies
float getAntiAliasing(float dist, float radius)
{
    // 
    float aaDelta = fwidth(dist);
    // 
    return smoothstep(radius - aaDelta, radius, dist);
}
// 
vec4 getColor(float fill, float stroke)
{
    vec4 color = vec4(1.);
    color = mix(color, vec4(1.), fill);
    color = mix(color, vec4(0.), stroke);
    return color;
}

void main()
{    
    // set up the composition
    float scale = 1. / min(u_resolution.x, u_resolution.y);
    vec2 p = scale * (2. * gl_FragCoord.xy - u_resolution.xy);
    p *= 1.02;
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
    float stroke = 1. - getAntiAliasing(d, 8. * scale);
    // render
    gl_FragColor = getColor(fill, stroke);
    gl_FragColor.a = 1.;// - gl_FragColor.a;
}