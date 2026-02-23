const CUT_LENGTH = 7.5;
const START = `${CUT_LENGTH}px`;
const END = `calc(100% - ${CUT_LENGTH}px)`;

export const BASE_CLASS_NAME = "button group";
export const CLIP_PATH = `polygon(${START} 0, ${END} 0%, 100% ${START}, 100% ${END}, ${END} 100%, ${START} 100%, 0% ${END}, 0% ${START})`;
export const CORNERS_CLIP_PATH = "polygon(0 0, 0% 100%, 100% 0)";
