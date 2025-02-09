import { Box, IconButton, } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

type Props = {
    images: any
    setNewImages: (images: any) => void
};

const AddedImagesViewer = ({ images, setNewImages }: Props) => {
    const handleDeleteImage = (index: number) => {
        const dataTransfer = new DataTransfer();
        Array.from(images).forEach((image: any, i: number) => index !== i && dataTransfer.items.add(image));
        setNewImages(dataTransfer.files);
    }

    return <Box sx={{ mt: 2, textAlign: "justify" }}>
        {Array.from(images).map((image: any, i: number) => <Box key={i} sx={{ position: "relative", display: "inline-block", mr: 2 }}>
            <IconButton
                size="small"
                sx={(theme) => ({
                    position: "absolute",
                    top: -5,
                    left: -5,
                    backgroundColor: theme.palette.error.main,
                    color: "#fff",
                    "&:hover": { opacity: 1, backgroundColor: theme.palette.error.main + "88", color: "#fff" },
                    outline: "none !important",
                    zIndex: 10,
                    width: "8px",
                    height: "8px",
                })}
                key={i}
                onClick={() => handleDeleteImage(i)}
            >
                <CancelIcon />
            </IconButton>
            <img
                src={typeof image === "string" ? (window?.location?.origin.replace(":5173", ":3000") + "/api/images?name=" + image) : URL.createObjectURL(image as Blob)}
                alt="Selected"
                style={{ width: "50px", height: "50px", /*objectFit: "contain"*/ }}
            />
        </Box>
        )}
    </Box>
}


const AddImageIconButton = ({ handleImagesChange }: any) => {
    return <IconButton
        aria-label="AddPhoto"
        component="label"
        sx={(theme) => ({
            ml: "8px",
            p: 0,
            color: theme.palette.primary.main,
            "&:hover": { opacity: 0.7 },
            outline: "none !important",
        })}
    >
        <AddAPhotoIcon />
        <input
            name="images"
            type="file"
            accept="image/*"
            onChange={(e: any) => {
                // console.log(e.target.files)
                // console.log(Array.from(e.target.files))
                // const files = Array.from(e.target.files);
                // const newImages = files
                // const newImages = {
                //     imagesAsFiles: files,
                //     imagesAsBlob: files.map(file => URL.createObjectURL(file as Blob))
                // }
                // handleImagesChange(newImages)
                handleImagesChange(e.target.files)
            }}
            hidden
            multiple
        />
    </IconButton>
}

export { AddImageIconButton, AddedImagesViewer }
export default AddedImagesViewer