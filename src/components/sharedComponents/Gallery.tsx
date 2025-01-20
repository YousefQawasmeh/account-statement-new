import { IconButton, ImageList, ImageListItem } from "@mui/material"
import CollectionsIcon from '@mui/icons-material/Collections';
import Dialog from '@mui/material/Dialog';


type PropsGallery = {
    images: string[];
    onClose: () => void
}
const Gallery = ({ images, onClose }: PropsGallery) => {
    const cols = images.length > 1 ? 2 : 1
    const width = images.length > 1 ? 750 : 525
    const height = images.length === 1 ? 700 : images.length === 2 ? 500 : 600
    const rowHeight = images.length === 1 ? 700 : 500

    const showOrginalImage = (url: string) => () => window.open(url, "_blank")

    return <Dialog open={true} onClose={onClose} maxWidth={"lg"}> <ImageList sx={{ width, height, overflow: images.length > 2 ? "auto" : "hidden" /* , position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" */ }} cols={cols} rowHeight={rowHeight}>
        {images.map((imageURL: string) => (
            <ImageListItem key={imageURL}>
                <img
                    onDoubleClick={showOrginalImage(`${window?.location?.origin.replace(":5173", ":3000")}/api/images?name=${imageURL}`)}
                    style={{ objectFit: "fill" }}
                    srcSet={`${window?.location?.origin.replace(":5173", ":3000")}/api/images?name=${imageURL}`}
                    src={`${window?.location?.origin.replace(":5173", ":3000")}/api/images?name=${imageURL}`}
                    //   alt={item.title}
                    loading="lazy"
                />
            </ImageListItem>
        ))}
    </ImageList>
    </Dialog>
}

type PropsGalleryIcon = {
    no?: number;
    onClick?: any;
    hiddenNo?: boolean
}
const GalleryIcon = ({ no, hiddenNo, onClick }: PropsGalleryIcon) => {
    return <IconButton sx={{ scale: "80%" }} size="small" onClick={onClick}>
        <CollectionsIcon sx={{ opacity: 0.7, color: 'green' }} />
        {!hiddenNo && <span style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            color: "white",
            background: "#ff6060",
            width: "25px",
            height: "25px",
            borderRadius: "50%",
            fontSize: "14px",
            alignContent: "center",
            scale: "70%",
        }}>
            {no}
        </span>}
    </IconButton>
}


export { GalleryIcon, Gallery }