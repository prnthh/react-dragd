import { RgbaStringColorPicker } from "react-colorful";

export default function ColorPicker ({color, onChange, onClose}) {
    return <>
    <div onBlur={()=>{
        onClose();
        }}>
        <RgbaStringColorPicker
            color={color || 'black'}
            onChange={onChange}
        />
    </div>
    </>
}