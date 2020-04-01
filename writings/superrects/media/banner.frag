#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
//
float tanh(float t)
{
    float e=exp(2.*t);
    return(e-1.)/(e+1.);
}
//
float atanh(float x)
{
    return.5*log((1.+x)/(1.-x));
}
//
const float k=1.19228;
//
float sinf(float t)
{
    return tanh(k*tan(t));
}
//
float asinf(float y)
{
    return atan(atanh(y)/k);
}
//
float cosf(float t)
{
    return tanh(k/tan(t));
}
//
float acosf(float x)
{
    return atan(k/atanh(x));
}
//
vec4 getColor(float fill,float stroke)
{
    vec4 color=vec4(0.);
    color=mix(color,vec4(vec3(1.),1.),fill);
    color=mix(color,vec4(vec3(1.),1.),stroke);
    return color;
}

void main()
{
    float t=8.*u_time;
    t=.5+.5*clamp(sinf(t),-1.,1.)*sign(cos(t));
    float s=mix(1.618,4.,t);
    // set up the composition
    float scale=s/min(u_resolution.x,u_resolution.y);
    vec2 p=scale*(2.*gl_FragCoord.xy-u_resolution.xy);
    // make sure it's always at least a certain size
    float r=max(16.*scale,.015);
    //animate
    // float t=1.5*u_time;
    // float sine=.5+.5*sin(t);
    // float tri=.5+asin(sin(t))/3.14;
    // float h=mix(tri,sine,ceil(cos(t)));
    // take advantage of symmetry
    p=-abs(p);
    //stay stable
    p+=t;
    p.x=min(p.x,0.);
    p.y=min(p.y,-.000001);
    // since the shape is convex we can be sure which points are inside
    float florp=1.-clamp(dot(p,p)/(s*s),0.,1.);
    float x=p.y-sinf(acosf(p.x));
    float y=p.x-cosf(asinf(p.y));
    float fill=step(.0,x)*step(.0,y);
    // fill=exp(-1./florp)/exp(-1.);
    // distance field becomes assymptotically correct as points get close to curve
    float d=x*y*inversesqrt(x*x+y*y);
    float stroke=smoothstep(r,r-4.*scale,d);
    // render
    gl_FragColor=getColor(fill,stroke);
}