import { Link } from "react-router";

export function Home() {
  return (
    <div id="page-landing">
      <div id="page-landing-content" className="container">
        <div className="logo-container">
          <h2>Sua plataforma de estudos online.</h2>
        </div>

        {/*  <img
          src={landingImg}
          alt="Plataforma de estudos"
          className="hero-image"
        /> */}

        <div className="buttons-container">
          <Link to="/study" className="study">
            Estudar
          </Link>

          <Link to="/give-classes" className="give-classes">
            Dar aulas
          </Link>
        </div>

        {/* <span className="total-connections">
          Total de {totalConnections} conexões já realizadas{" "}
          <img src={purpleHeartIcon} alt="Coração roxo" />
        </span> */}
      </div>
    </div>
  );
}
