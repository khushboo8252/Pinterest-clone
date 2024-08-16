import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePinData } from '../context/PinContext';
import { Loading } from '../components/Loading.jsx';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from "react-icons/fa";

const Pinpage = ({ user }) => {
  const params = useParams();

  const { loading, fetchPin, pin, updatePin, addComment, deleteComment, deletePin } = usePinData();
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [pinValue, setPinValue] = useState("");

  const editHandler = () => {
    setTitle(pin.title);
    setPinValue(pin.pin)
    setEdit(!edit)
  };

  const updateHandler = () => {
    updatePin(pin._id, title, pinValue, setEdit)
  };

  const submitHandler = (e) => {
    e.preventDefault();
    addComment(pin._id, comment, setComment)
  };

  const deleteCommentHandler = (id) => {
    deleteComment(pin._id, id)
  }

  const navigate = useNavigate()

  const deletePinHandler = () => {
    if (confirm("Are you sure to delete this pin"))
      deletePin(pin._id, navigate)
  }

  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchPin(params.id);
  }, [params.id]);

  return (
    <div>
      {
        pin && (
          <div className='flex flex-col items-center bg-gray-100 p-4 min-h-screen '>
            {loading ? <Loading /> : <div className='bg-white rounded-lg shadow-lg flex flex-wrap w-full max-w-4xl'>
              <div className='w-full md:w-1/2 bg-gray-200 rounded-t-lg md:rounded-l-lg md:rounded-t-none flex items-center justify-center'>
                {
                  pin.image && (
                    <img src={pin.image.url} alt="" className='object-cover w-full rounded-t-lg md:rounded-l-lg md:rounded-t-none' />
                  )
                }
              </div>

              <div className='w-full md:w-1/2 p-6 flex flex-col '>
                <div className='flex items-center justify-between mb-4 '>
                  {
                    edit ? (<input value={title} onChange={e => setTitle(e.target.value)} className='common-input' style={{ width: "200px" }} placeholder='Enter Title' />) : (
                      <h1 className='text-2xl font-bold'>{pin.title}</h1>
                    )}

                  {
                    pin.owner && pin.owner._id === user._id && <button onClick={editHandler}><FaEdit /></button>
                  }

                  {
                    pin.owner && pin.owner._id === user._id && (
                      <button onClick={deletePinHandler} className='bg-red-500 text-white py-1 px-3 rounded'><MdDelete /></button>
                    )}
                </div>

                {
                  edit ?
                    (<input value={pinValue} onChange={(e) => setPinValue(e.target.value)} className='common-input' style={{ width: "200px" }} placeholder='Enter Pin' />) :
                    (<p className='mb-6'>{pin.pin}</p>
                    )}

                {
                  edit && (
                    <button style={{ width: "200px" }} className='bg-red-500 text-white py-1 px-3 mt-2 mb-2' onClick={updateHandler}>Update</button>
                  )
                }

                {
                  pin.owner && (
                    <div className='flex items-center justify-between border-b pb-4 mb-4'>
                      <div className='flex items-center '>
                        <Link to={`/user/${pin.owner._id}`}>
                          <div className='rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center'>
                            <span className='font-bold'>{pin.owner.name.slice(0, 1)}</span>
                          </div>
                        </Link>
                        <div className='ml-4'>
                          <h2 className='text-lg font-semibold'>{pin.owner.name}</h2>
                          <p className='text-gray-500'>{pin.owner.followers.length} Followers</p>
                        </div>
                      </div>
                    </div>
                  )
                }

                <div className='flex items-center mt-4'>
                  <div className='rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center mr-4'>
                    <span className='font-bold'>{pin.owner && pin.owner.name.slice(0, 1)}</span>
                  </div>

                  <form className='flex-1 flex ' onSubmit={submitHandler}>
                    <input type='text' placeholder='Enter Comment' required value={comment} onChange={e => setComment(e.target.value)} className='flex-1 border rounded-lg p-2 ' />
                    <button type='submit' className='ml-2 bg-red-500 px-4 py-2 rounded-md text-white'>Add+</button>
                  </form>
                </div>
                <hr className='font-bold text-gray-400 mt-3 mb-3 ' />

                <div className='overflow-y-auto h-64'>
                  {pin.comments && pin.comments.length > 0 ? pin.comments.map((e) => (
                    <div key={e._id} className='flex items-center justify-between mb-4'>
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Link to={`/user/${e.user}`}>
                          <div className='rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center'>
                            <span className='font-bold'>
                              {e.name.slice(0, 1)}
                            </span>
                          </div>
                        </Link>

                        <div className='ml-4'>
                          <div className='ml-4'>
                            <h2 className='text-lg font-semibold'>
                              {e.name}
                            </h2>
                            <p className='text-gray-500'>{e.comment}</p>
                          </div>
                        </div>

                        {e.user === user._id && <button onClick={() => deleteCommentHandler(e._id)} className='bg-red-500 text-white py-1 px-3 rounded'><MdDelete /></button>}
                      </div>
                    </div>
                  )) : <p>Be the first one to add comment</p>}
                </div>
              </div>

            </div>
            }
          </div>
        )
      }
    </div>
  )
}

export default Pinpage;
