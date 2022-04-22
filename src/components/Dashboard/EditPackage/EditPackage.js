import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../api/axios";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import "./EditPackage.scss";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
const defaultPackages = ["Employment","Self employment","Pension Income","Partnership"];
const EditPackage = () => {
  const [list, setList] = useState([[]]);
  const [isLoading, setIsLoading] = useState(false); 

  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setIsLoading(true);
    if (params.orderId) {
      const getData = async () => {
        try {

          const response = await axiosPrivate.get(`https://tax.api.cyberozunu.com/api/v1.1/Order/${params.orderId}`);

        setList(response.data.result);
      
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          // navigate('/', { state: { from: location }, replace: true });
          setIsLoading(false);
        }
      };

      getData();
    } else {
      navigate("/account");
    }
  }, []);

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
);

  const hanclickEdit = (id, packageName) => {
    navigate(`/${(packageName).toLowerCase().replace(/\s/g, '')}/${params.orderId}/?packageId=${id}`);
  }

  return (
    <div className="EditPackage">
      <p className="title is-3 header">Choose a document to edit: </p>
      <div className="content-wrapper-1">
        <div className="cards-grid-1 container" >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{
                  // height: "100vh",
                  flexGrow: 1,
                  width: "100%",
                  // overflowY: "auto",
                  textAlign:"left"
                }}
              >
                {defaultPackages.map((l,i) => {
                 
                  if(i===0){
                    return(
                      <TreeItem nodeId={l+"-"+i} label={<p style={{padding:"0.5rem",margin:"0.5rem"}} className="title is-3 package-title">{l+"  "+"("+list["employmentDetails"]?.length+")"}</p>}>
                          {list["employmentDetails"]?.map((p,v) => <TreeItem className="test"  nodeId={p.name+"-"+v} label={<div key={p.name+"-"+v}  className="sigle-line"><p style={{padding:"0.5rem",margin:"0.5rem"}} className="subtitle is-5 information-title">{v+1+". "+p.name}</p> <div><button className="button is-success" onClick={()=> hanclickEdit(p.id,l)}>Edit</button> <button className="button is-danger" onClick={()=> hanclickEdit(p.id,l)}>Delete</button></div></div> } />) }
                        
                      </TreeItem>
                    )
                  }else if(i===1){
                    return(
                      <TreeItem nodeId={l+"-"+i} label={<p style={{padding:"0.5rem",margin:"0.5rem"}} className="title is-3 package-title">{l+"  "+"("+list["selfEmploymentDetails"]?.length+")"}</p>}>
                          {list["selfEmploymentDetails"]?.map((p,v) => <TreeItem nodeId={p.name+"-"+v} label={<div key={p.name+"-"+v} className="sigle-line"><p style={{padding:"0.5rem",margin:"0.5rem"}} className="subtitle is-5 information-title">{v+1+". "+p.name}</p><div> <button className="button is-success"  onClick={()=> hanclickEdit(p.id,l)}>Edit</button> <button className="button is-danger" onClick={()=> hanclickEdit(p.id,l)}>Delete</button></div></div>} />)}
                        
                      </TreeItem>
                    )
                  }else if(i===2){
                    return(
                      <TreeItem nodeId={l+"-"+i} label={<p style={{padding:"0.5rem",margin:"0.5rem"}} className="title is-3 package-title">{l+"  "+"("+list["pensionDetails"]?.length+")"}</p>}>
                          {list["pensionDetails"]?.map((p,v) => <TreeItem nodeId={p.name+"-"+v} label={<div key={p.name+"-"+v} className="sigle-line"><p style={{padding:"0.5rem",margin:"0.5rem"}} className="subtitle is-5 information-title">{v+1+". "+p.name}</p> <div> <button className="button is-success"  onClick={()=> hanclickEdit(p.id,l)}>Edit</button> <button className="button is-danger" onClick={()=> hanclickEdit(p.id,l)}>Delete</button></div></div>} />)}
                        
                      </TreeItem>
                    )
                  }else if(i===3){
                    return(
                      <TreeItem nodeId={l+"-"+i} label={<p style={{padding:"0.5rem",margin:"0.5rem"}} className="title is-3 package-title">{l+"  "+"("+list["partnershipDetails"]?.length+")"}</p>}>
                          {list["partnershipDetails"]?.map((p,v) => <TreeItem nodeId={p.name+"-"+v} label={<div key={p.name+"-"+v}  className="sigle-line"><p style={{padding:"0.5rem",margin:"0.5rem"}} className="subtitle is-5 information-title">{v+1+". "+p.name}</p> <div> <button className="button is-success" onClick={()=> hanclickEdit(p.id,l)}>Edit</button> <button className="button is-danger" onClick={()=> hanclickEdit(p.id,l)}>Delete</button></div></div>} />)}
                        
                      </TreeItem>
                    )
                  }
                  
                }
                
                )}
              </TreeView>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPackage;
