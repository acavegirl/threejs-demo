import * as Three from 'three'
import imgSrc from '../assets/imgs/mapping.jpg' //引入图片资源

export const MaterialType = {
  MESH_PHONE_MATERIAL: 'MESH_PHONE_MATERIAL',
  MESH_STANDARD_MATERIAL: 'MESH_STANDARD_MATERIAL'
}


const createScene = (type=MaterialType.MESH_PHONE_MATERIAL) => {

    const scene = new Three.Scene()

    const planeSize = 40

    const loader = new Three.TextureLoader()
    const texture = loader.load(imgSrc)
    // texture.wrapS = Three.RepeatWrapping
    // texture.wrapT = Three.RepeatWrapping
    // texture.magFilter = Three.NearestFilter
    // texture.repeat.set(planeSize / 2, planeSize / 2)

    let planeMat
    let cubeMat
    let sphereMat
    switch (type) {
        case MaterialType.MESH_STANDARD_MATERIAL:
            planeMat = new Three.MeshStandardMaterial({
                map: texture,
                side: Three.DoubleSide
            })
            cubeMat = new Three.MeshStandardMaterial({ color: '#8AC' })
            sphereMat = new Three.MeshStandardMaterial({ color: '#CA8' })
            break
        default:
            planeMat = new Three.MeshPhongMaterial({
                map: texture,
                side: Three.DoubleSide
            })
            cubeMat = new Three.MeshPhongMaterial({ color: '#8AC' })
            sphereMat = new Three.MeshPhongMaterial({ color: '#8AC' })
    }

    const planeGeo = new Three.PlaneGeometry(planeSize, planeSize)
    const mesh = new Three.Mesh(planeGeo, planeMat)
    mesh.rotation.x = Math.PI * -0.5
    scene.add(mesh)

    const cubeGeo = new Three.BoxGeometry(4, 4, 4)
    const cubeMesh = new Three.Mesh(cubeGeo, cubeMat)
    cubeMesh.position.set(5, 2.5, 0)
    scene.add(cubeMesh)

    const sphereGeo = new Three.SphereGeometry(3, 32, 16)
    const sphereMesh = new Three.Mesh(sphereGeo, sphereMat)
    sphereMesh.position.set(-4, 5, 0)
    scene.add(sphereMesh)

    const axes = new Three.AxesHelper(20)
    axes.renderOrder = 10 // renderOrder 的该值默认为 0，这里设置为 1 ，目的是为了提高优先级，避免被物体本身给遮盖住
    scene.add(axes)

    

    return scene
}

export default createScene