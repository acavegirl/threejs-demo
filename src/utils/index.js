import { Mesh, MeshPhongMaterial, Object3D, PointLight, SphereGeometry, MeshLambertMaterial, MeshToonMaterial } from "three"

//创建一个球体
const sphere = new SphereGeometry(1, 6, 6) //球体为6边形，目的是为了方便我们观察到他在自转

//创建太阳
const sunMaterial = new MeshPhongMaterial({ emissive: 0xFFFF00 })
const sunMesh = new Mesh(sphere, sunMaterial)
sunMesh.scale.set(4, 4, 4) //将球体尺寸放大 4 倍

//创建地球
const earthMaterial = new MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 })
const earthMesh = new Mesh(sphere, earthMaterial)

//创建月球
const moonMaterial = new MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 })
const moonMesh = new Mesh(sphere, moonMaterial)
moonMesh.scale.set(0.5, 0.5, 0.5) //将球体尺寸缩小 0.5 倍


export const moonOribit = new Object3D()
// moonOribit.position.x = 2
moonOribit.add(moonMesh)

export const earthOrbit = new Object3D()
// earthOrbit.position.x = 10
earthOrbit.add(earthMesh)
earthOrbit.add(moonOribit)
moonOribit.position.x = 2

export const solarSystem = new Object3D()
solarSystem.add(sunMesh)
solarSystem.add(earthOrbit)
earthOrbit.position.x = 10


//创建点光源
export const pointLight = new PointLight(0xFFFFFF, 3)
// pointLight.position.set( 50, 50, 50 );

export default {}