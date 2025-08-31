import { Summary } from '../export.react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/summary')({
  component: RouteComponent,
});

const content = `
  # Lorem Ipsum

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

  ## Ut enim ad minim veniam

  Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

  ### Duis aute irure dolor

  - In reprehenderit in voluptate
  - Velit esse cillum dolore
  - Eu fugiat nulla pariatur

  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

  **Sed ut perspiciatis** unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

  *Totam rem aperiam*, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.o

  ## Nemo enim ipsam voluptatem

  Quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

  ### Neque porro quisquam est

  1. Qui dolorem ipsum quia dolor sit amet
  2. Consectetur adipisci velit
  3. Sed quia non numquam eius modi tempora incidunt

  > At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

  #### Similique sunt in culpa

  Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.


  **Temporibus autem quibusdam** et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.

  *Itaque earum rerum* hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.

  ### Nam libero tempore

  - Cum soluta nobis est eligendi optio
  - Cumque nihil impedit quo minus
  - Id quod maxime placeat facere possimus
    - Omnis voluptas assumenda est
    - Omnis dolor repellendus

  Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.

  ## Et harum quidem rerum

  Facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
  `;

function RouteComponent() {
  return (
    <div>
      <style>
        {`
            .cell {
              padding: 10px;
            }
            .box {
              box-shadow: 0 2px 3px rgba(0, 0, 0, .1);
            }
          `}
      </style>
      <div style={{ height: 44, background: 'pink' }} />
      <div style={{ maxWidth: 1500, display: 'flex', margin: '0 auto' }}>
        <div style={{ flex: '0 0 770px', background: 'lightblue' }}>main</div>
        <div id="chaonima-v2ex-cnt">
          <Summary onClickCloseButton={() => {}} content={content} />
        </div>
      </div>
    </div>
  );
}
