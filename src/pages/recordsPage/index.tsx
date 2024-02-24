import { Link } from "@mui/material";
import RecordsList from "./components/RecordsList";
import { useLocation } from "react-router-dom";

const RecordsPage = () => {
    const { search } = useLocation();
    const query: any = new URLSearchParams(search);
    const filters: any = {};
    for (const [key, value] of query.entries()) filters[key] = value
    return (
        <>
            <Link href="/account-statement-new/" style={{ alignSelf: "flex-start", display: "flex", marginBottom: "20px", width: "fit-content" }} > الصفحة الرئيسية</Link>
            <RecordsList filters={filters} />
        </>
    )
}
export default RecordsPage
