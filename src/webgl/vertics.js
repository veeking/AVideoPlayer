// 顶点初始坐标数据：left-bottom左下、right-bottom右下、left-top左上、right-top右上

export const texturePortraitVertices = {
  // 竖向时候 遮罩在前的时候的 主视频位置
  front: [
    1.0, 0.5,
    0.0, 0.5,
    0.0, 0.0,
    1.0, 0.0
  ],
  back: [
    0.0, 1.0,
    1.0, 1.0,
    0.0, 0.5,
    1.0, 0.5
  ]
}

export const textureLandscapeVertices = {
  // 横向时候 遮罩在前的时候的 主视频位置
  front: [
    0.5, 1.0,
    1.0, 1.0,
    0.5, 0.0,
    1.0, 0.0
  ],
  back: [
    0.0, 1.0,
    0.5, 1.0,
    0.0, 0.0,
    0.5, 0.0
  ]
}

export const stencilOffsetPortraitVertices = {
  front: [
    0.0, -0.5
  ],
  back: [
    0.0, 0.5
  ]
}
export const stencilOffsetLandscapeVertices = {
  front: [
    -0.5, 0.0
  ],
  back: [
    0.5, 0.0
  ]
}
