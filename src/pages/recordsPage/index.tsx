import { Link } from "@mui/material";
import RecordsList from "./components/RecordsList";

const RecordsPage = () => {

    return (
        <>
            <Link href="/" style={{ alignSelf: "flex-start", display: "flex", marginBottom: "20px", width: "fit-content" }} > الصفحة الرئيسية</Link>
            <RecordsList />
        </>
    )
}
export default RecordsPage
