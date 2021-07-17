import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'


const ProfileSideBar = (props) => {
  return(
    <Box>
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />

      <hr />

      <p>
        <a className="boxlink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>

      <ul>
        {/* {props.items.map((item) => {
          return (
            <li key={item}>
              <a href={`users/${item}`}>
                <img src={`https://github.com/${item}.png`} />
                <span>{item}</span>
              </a>
            </li>
          )
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const usuarioGithub = 'cfasilva'

  const pessoasFavoritas = ['tiago100h', 'aurilio', 'badaroz']

  const [comunidadesFavoritas, setComunidadeFavoritas] = React.useState([{
    id: new Date().toISOString(),
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
  }])

  const [seguidoresFavoritos, setSeguidoresFavoritos] = React.useState([])

  React.useEffect(function() {
    fetch('https://api.github.com/users/cfasilva/followers')
      .then(function (response) {
        return response.json()
      })
      .then(function (responseConvert) {
        setSeguidoresFavoritos(responseConvert)
      })
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={usuarioGithub} />

      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={usuarioGithub} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={(e) => {
              e.preventDefault()

              const dadosForm = new FormData(e.target)
              const comunidade = {
                id: new Date().toISOString(),
                title: dadosForm.get('title'),
                image: dadosForm.get('image'),
              }
              
              setComunidadeFavoritas([...comunidadesFavoritas, comunidade])
            }}>
              <div>
                <input type="text" placeholder="Qual vai ser o nome da sua comunidade?" name="title" aria-label="Qual vai ser o nome da sua comunidade?" />
              </div>
              <div>
                <input placeholder="Coloque uma url para usarmos de capa" name="image" aria-label="Coloque uma url para usarmos de capa" />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidoresFavoritos} />
          <ProfileRelationsBox title="Pessoas" items={pessoasFavoritas} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidadesFavoritas.length})
            </h2>

            <ul>
              {comunidadesFavoritas.map((item) => {
                return (
                  <li key={item.id}>
                    <a href={`users/${item.title}`}>
                      <img src={item.image} />
                      <span>{item.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
