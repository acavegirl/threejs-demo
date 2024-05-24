import { Mesh, MeshPhongMaterial, Object3D, PointLight, SphereGeometry, MeshLambertMaterial, MeshToonMaterial, DirectionalLight, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhysicalMaterial } from "three"

//创建一个球体
const sphere = new SphereGeometry(1, 6, 6) //球体为6边形，目的是为了方便我们观察到他在自转

//创建太阳
const sunMaterial = new MeshToonMaterial({ color: 0xFFFF00})
export const sunMesh = new Mesh(sphere, sunMaterial)
sunMesh.scale.set(4, 4, 4) //将球体尺寸放大 4 倍

//创建地球
const earthMaterial = new MeshBasicMaterial({ color: 0x00ff00})
export const earthMesh = new Mesh(sphere, earthMaterial)

//创建月球
const moonMaterial = new MeshPhongMaterial({ color: 0x888888 })
export const moonMesh = new Mesh(sphere, moonMaterial)
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
export const light = new DirectionalLight(0xFFFFFF, 1)
light.position.set(0, 0, 100)

// solarSystem.add(light)

export default {}