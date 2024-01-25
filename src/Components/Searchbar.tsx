//import SearchIcon from '@mui/icons-material/Search';
import { ChangeEvent, CSSProperties } from 'react';

const styles = {
    container:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        height:"2em",
    } as CSSProperties,
    searchIcon: {
        borderWidth:"0",
        backgroundColor:"white",
        borderRadius:"16px 0 0 16px"
    },
    input: {
        backgroundColor:"white",
        borderWidth:"0",
        outline:"none",
        borderRadius:"16px",
        width:"50%",
        //borderRadius:" 0 16px 16px 0",
        fontSize:"18px"
    },
}
type SearchBarProps = {
    searchBarInput:string;
    setSearchBarInput:(value:string) => void
}
const Searchbar = (props:SearchBarProps) => {
    return (
        <div style={styles.container}>
            {/*<div style={styles.searchIcon}><SearchIcon/></div>*/}
            <input value={props.searchBarInput} placeholder=" Search user" onChange={(event:ChangeEvent<HTMLInputElement>) => props.setSearchBarInput(event.target.value)} style={styles.input}/>
        </div>
    )
}
export default Searchbar