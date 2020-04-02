import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';

const Container = styled.div`
  .flex {
    display: flex;
    justify-content: space-between;
    background-color: ${props => props.theme.lightgreen};
  }
  .logo {
    margin: 0 2rem;
    font-size: 2rem;
    a {
      color: ${props => props.theme.black};
    }
    img {
      height: 2rem;
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
      font-size: 2rem;
      color: ${props => props.theme.black};
    }
  }
`;

const Header = () => (
    <Container>
      <div className="flex">
        <div className="logo">
          <Link href="/landing">
            <a>
              <img src="/flossfist.png" alt="logo"/>
              ours to save
            </a>
          </Link>
        </div>
        <div className="links">
          <Link href="/map">
            <a>map</a>
          </Link>
          <Link href="/stories">
            <a>stories</a>
          </Link>
          <Link href="/initiatives">
            <a>initiatives</a>
          </Link>
        </div>
      </div>
    </Container>
);

export default Header;
