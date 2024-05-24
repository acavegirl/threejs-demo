import { useEffect, useRef, useState } from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

import createScene, { MaterialType } from '../utils/creatScene.js'



const LightType = {
    AmbientLight : 'AmbientLight',
    AmbientLightProbe : 'AmbientLightProbe',
    DirectionalLight : 'DirectionalLight',
    HemisphereLight : 'HemisphereLight',
    HemisphereLightProbe : 'HemisphereLightProbe',
    PointLight : 'PointLight',
    RectAreaLight : 'RectAreaLight',
    SpotLight : 'SpotLight'
}

const buttonLabels = [LightType.AmbientLight, LightType.AmbientLightProbe, LightType.DirectionalLight,
LightType.HemisphereLight, LightType.HemisphereLightProbe, LightType.PointLight,
LightType.RectAreaLight, LightType.SpotLight]

export default () => {

    const canvasRef = useRef(null)
    const sceneRef = useRef(null)
    const cameraRef = useRef(null)

    const [type, setType] = useState(LightType.AmbientLight)

    useEffect(() => {

        if (canvasRef.current === null) {
            return
        }

        const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current})

        const scene = createScene()
        sceneRef.current = scene

        const camera = new Three.PerspectiveCamera(50, 2, 0.1, 1000)
        camera.position.set(10, 10, 60)
        cameraRef.current = camera

        const helper = new Three.CameraHelper( cameraRef.current )
        scene.add( helper )

        const ambientLight = new Three.AmbientLight(0xFFFFFF, 1)
        scene.add(ambientLight)

        const controls = new OrbitControls(camera, canvasRef.current)
        controls.target.set(0, 0, 0)
        controls.update()

        

        const render = () => {
            if (sceneRef.current) {
                renderer.render(sceneRef.current, cameraRef.current)
            }
            window.requestAnimationFrame(render)
        }
        window.requestAnimationFrame(render)

        const handleResize = () => {
            const canvas = canvasRef.current
            if (canvas === null) {
                return
            }
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
        }
        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [canvasRef])

    return (
        <div className='full-screen'>
            <canvas ref={canvasRef} />
        </div>

    )

}