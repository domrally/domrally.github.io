#ifdef GL_ES
precision mediump float;
#endif

// #extension GL_OES_standard_derivatives : enable

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
// 
float flatstep(float low, float high, float t)
{
    float u = (t - low) / (high - low);
    u = clamp(0., 1., u);
    return .5 + .5 * cosf(u * 3.14);
}
// gets rid of the jaggies
float getAntiAliasing(float dist, float radius)
{
    return flatstep(0., radius, dist);
    // 
    // float aaDelta = fwidth(dist);
    // 
    // return flatstep(radius - aaDelta, radius, dist);
    // return smoothstep(radius, radius - aaDelta, dist);
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
    // fixed pixel width
    float r = 16. * scale;
    // relative container width
    r = .015;
    // make sure it's always at least a certain size
    r = max(16. * scale, .015);
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
    // float stroke = getAntiAliasing(d, r);
    float stroke = flatstep(r - 4. * scale, r, d);
    // stroke *= fill;
    // render
    gl_FragColor = getColor(fill, stroke);
    gl_FragColor.a = 1.;// - gl_FragColor.a;
}