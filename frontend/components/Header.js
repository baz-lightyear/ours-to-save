import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';

const Container = styled.div`
  .filler {
    height: 80px;
    width: 100%;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.theme.green};
    height: 80px;
    width: 100%;
    position: fixed;
    z-index: 2;
  }
  .logo {
    margin: 0 2rem;
    font-size: 1.5rem;
    a {
      color: ${props => props.theme.offWhite};
    }
    img {
      height: 1.5rem;
      padding-right: 1rem;
      position: relative;
      bottom: -4px;
    }
  }
  .links {
    display: flex;
    margin: 0 2rem;
    a {
      margin: 0 1rem;
      font-size: 1.5rem;
      color: ${props => props.theme.offWhite};
    }
  }
  @media (min-width: 701px) {
    .flex {
      .mobileBurger {
        display: none;
      }
    }
  }
  @media (max-width: 700px) {
    .flex {
      .links {
        display: none;
      }
      .mobileBurger {
        display: block;
        padding: 1rem;
        img {
          height: 40px;
          position: relative;
          top: 3px;
        }
      }
    }
  }
`;

const Header = () => (
    <Container>
      <div className="flex">
        <div className="logo">
          <Link href="/">
            <a>
              <img src="/flossfist.png" alt="logo"/>
              ours to save
            </a>
          </Link>
        </div>
        <div className="links">
          <Link href="/live">
            <a>live</a>
          </Link>
          <Link href="/featured">
            <a>featured</a>
          </Link>
          <Link href="/about">
            <a>about</a>
          </Link>
        </div>
        <div className="mobileBurger">
          <img src="burger.png" alt="burgerMenuIcon"/>
        </div>
      </div>
      <div className="filler"></div>
    </Container>
);

export default Header;
