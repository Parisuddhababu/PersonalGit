import { Accordion, Box, AccordionSummary, Typography, AccordionDetails } from "@mui/material"

export const CartGiftCardOptions = (): JSX.Element => {
  return (
    <Box>
       <Accordion>
        <AccordionSummary
          expandIcon={">"}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Gift options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default CartGiftCardOptions