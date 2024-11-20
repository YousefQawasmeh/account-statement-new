import RecordsList from "./components/RecordsList";
import { useLocation } from "react-router-dom";

const RecordsPage = () => {
    const { search } = useLocation();
    const query: any = new URLSearchParams(search);
    const filters: any = {};
    for (const [key, value] of query.entries()) filters[key] = value
    return (
        <>
            <RecordsList filters={filters} />
        </>
    )
}
export default RecordsPage
