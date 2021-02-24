import React from 'react'
import styled from 'styled-components'
import { Hamburger } from './Icons'

const Footer = props => (
  <Container>
    <button
      name='hamburger'
      onClick={ props.handleClick }
      className='button'
    >
      <Hamburger clicked={ props.clicked }/>
    </button>
  </Container>
)

export default Footer

const Container = styled.div`
	width: 100%;
	height: 80px;
	background-color: var(--primary-2);
	display: flex;
	justify-content: center;
	align-items: center;
	.button {
		padding: 0;
		border-radius: 50%;
		background-color: var(--primary-1);
		outline: none;
		width: 50px;
		height: 50px
	}
`