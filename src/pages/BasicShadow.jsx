import { useEffect, useRef } from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import imgSrc from '../assets/imgs/mapping.jpg' //引入图片资源


const HelloShadow = () => {

    const canvasRef = useRef(null)

    useEffect(() => {
        if (canvasRef.current === null) {
            return
        }

        const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current })
        renderer.shadowMap.enabled = true

        const scene = new Three.Scene()
        scene.background = new Three.Color(0x333333)

        const camera = new Three.PerspectiveCamera(45, 2, 5, 1000)
        camera.position.set(30, 30, 60)
        scene.add(camera)

        const helperCamera = new Three.PerspectiveCamera(45, 2, 5, 100)
        helperCamera.position.set(20, 10, 20)
        helperCamera.lookAt(0, 0, 0)
        scene.add(helperCamera)

        const cameraHelper = new Three.CameraHelper(helperCamera)
        scene.add(cameraHelper)

        const controls = new OrbitControls(camera, canvasRef.current)
        controls.target.set(0, 5, 0)
        controls.update()

        const axes = new Three.AxesHelper(30)
        axes.renderOrder = 10 // renderOrder 的该值默认为 0，这里设置为 1 ，目的是为了提高优先级，避免被物体本身给遮盖住
        scene.add(axes)

        const light = new Three.DirectionalLight(0xFFFFFF, 1)
        light.castShadow = true
        light.position.set(0, 20, 0)
        light.target.position.set(-4, 0, -4)
        scene.add(light)
        scene.add(light.target)

        const shadowCamera = light.shadow.camera
        shadowCamera.left = -10
        shadowCamera.right = 10
        shadowCamera.top = 10
        shadowCamera.bottom = -15
        shadowCamera.far  = 50
        shadowCamera.updateProjectionMatrix()

        const lightHelper = new Three.DirectionalLightHelper(light)
        scene.add(lightHelper)

        const shadowHelper = new Three.CameraHelper(shadowCamera)
        scene.add(shadowHelper)

        const planeSize = 40

        const loader = new Three.TextureLoader()
        const texture = loader.load(imgSrc)

        const planGeo = new Three.PlaneGeometry(planeSize, planeSize)
        const planeMat = new Three.MeshPhongMaterial({
            map: texture,
            side: Three.DoubleSide
        })
        const planeMesh = new Three.Mesh(planGeo, planeMat)
        planeMesh.receiveShadow = true
        planeMesh.rotation.x = Math.PI * -0.5
        scene.add(planeMesh)

        const material = new Three.MeshPhongMaterial({
            color: 0x88AACC
        })
        const boxMat = new Three.BoxGeometry(4, 4, 4)
        const boxMesh = new Three.Mesh(boxMat, material)
        boxMesh.castShadow = true
        boxMesh.receiveShadow = true
        boxMesh.position.set(5, 3, 0)
        scene.add(boxMesh)

        const sphereMat = new Three.SphereGeometry(3, 32, 16)
        const sphereMesh = new Three.Mesh(sphereMat, material)
        sphereMesh.castShadow = true
        sphereMesh.receiveShadow = true
        sphereMesh.position.set(-4, 5, 0)
        scene.add(sphereMesh)

        const render = () => {
            cameraHelper.update()
            lightHelper.update()
            shadowHelper.update()

            renderer.render(scene, camera)
            window.requestAnimationFrame(render)
        }
        window.requestAnimationFrame(render)

        const handleResize = () => {
            if (canvasRef.current === null) {
                return
            }

            const width = canvasRef.current.clientWidth
            const height = canvasRef.current.clientHeight

            camera.aspect = width / height
            camera.updateProjectionMatrix()

            renderer.setSize(width, height, false)
        }
        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [canvasRef])

    return (
        <canvas ref={canvasRef} className='full-screen' />
    )
}

export default HelloShadow