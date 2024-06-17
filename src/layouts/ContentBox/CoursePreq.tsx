import './ContentBox.css'
import {Course} from '../../Interfaces'
import {useEffect , useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {Tooltip, IconButton } from '@mui/material'
import { styled } from '@mui/system'

const NoPadding_IconButton = styled(IconButton)({
    padding: '0px',
    '&:hover': {
      backgroundColor: 'transparent', // Override hover background color
    },
});

function CoursePreq({selectedCourse}:{ selectedCourse: Course | undefined }){
    const navigate = useNavigate();
    const handleSearch = (e : Course) => {
        navigate(`/course/${e.code}`);
    };
    const [preqCourseList , setCourseList] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                let newPreqCourseList: Course[] = [];
                if (selectedCourse !== undefined && selectedCourse.preq !== null) {
                    selectedCourse.preq.forEach( async (item) => {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/course/${item}`);
                        const recievedCourse = await response.json() as Course;
                        newPreqCourseList = [...newPreqCourseList, recievedCourse];
                        setCourseList(newPreqCourseList);
                    });
                }
            } catch(error){
                console.error('Error fetching dataaaaaaa:', error);
            } finally {
                
            }
        }

        fetchCourse();

      }, [selectedCourse]);
    return <div className = "ContentBox-Container">
        {selectedCourse !== undefined && selectedCourse.preq !== null  && (
            <>
                <div className = "subBox">
                    <div className = "subBox-title"> Prerequisite Message: </div>
                    <div> {selectedCourse.preq_message} </div>
                </div>
                {preqCourseList.map((item , index)=> (
                    <div key = {index} className = "subBox" onClick={() => handleSearch(item)}> 
                            <div className = "item-code" >{item.code}</div>
                            <Tooltip title = "click here to see the course on carleton's website" >
                                <NoPadding_IconButton>
                                    <a href = {item.link} target="_blank" className = "item-link"><div>{item.name}</div></a>
                                </NoPadding_IconButton>
                            </Tooltip>
                            <div className = "subBox-description">{item.description} </div>
                            <div> Credits: {String(item.credit)} </div>
                    </div>
                ))}
            </>
        )}
    </div>
}

export default CoursePreq;