import { useState } from 'react'

import { useForm, Controller, SubmitHandler } from "react-hook-form";

import { 
  Backdrop, 
  Modal, 
  Fade
} from '@mui/material'

export const Modales = () => {

  const [modal, setModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setModal(false);
  }

  return (
    <>
      <Modal 
        open={modal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          }
        }}
      >
        <Fade in={modal}>
          <form className=''>

            

          </form>
        </Fade>
      </Modal>
    </>
  )
}
