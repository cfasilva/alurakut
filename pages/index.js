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
        {props.items.map((item) => {
          return (
            <li key={item}>
              <a href={`users/${item}`}>
                <img src={`https://github.com/${item}.png`} />
                <span>{item}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const usuarioGithub = 'cfasilva'
  const pessoasFavoritas = ['tiago100h', 'aurilio', 'badaroz']
  const [seguidoresFavoritos, setSeguidoresFavoritos] = React.useState([])
  const [comunidadesFavoritas, setComunidadeFavoritas] = React.useState([])

  React.useEffect(function() {

    fetch('https://api.github.com/users/cfasilva/followers')
      .then(function (response) {
        return response.json()
      })
      .then(function (responseConvert) {
        setSeguidoresFavoritos(responseConvert.map(item => item.login))
        console.log(responseConvert)
      })
      .catch((error) => {
        console.log(error)
      })

    const token = '59732f30522db481f78fe8bb99a4ff';
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `{
            allCommunities {
              id
              title
              imageUrl
              creatorSlug
            }
          }`
      }),
    })
      .then(res => res.json())
      .then((res) => {
        setComunidadeFavoritas(res.data.allCommunities)
        console.log(res.data)
      })
      .catch((error) => {
        console.log(error)
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
                title: dadosForm.get('title'),
                imageUrl: dadosForm.get('image'),
                creatorSlug: usuarioGithub,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade),
              })
                .then(async (response) => {
                  const dados = await response.json()
                  console.log(dados.record)
                  setComunidadeFavoritas([...comunidadesFavoritas, dados.record])
                })
                .catch((error) => {
                  console.log(error)
                })
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
          <ProfileRelationsBox title="Pessoas" items={pessoasFavoritas} />
          <ProfileRelationsBox title="Seguidores" items={seguidoresFavoritos} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidadesFavoritas.length})
            </h2>

            <ul>
              {comunidadesFavoritas.map((item) => {
                return (
                  <li key={item.id}>
                    <a href={`communities/${item.id}`}>
                      <img src={item.imageUrl} />
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
