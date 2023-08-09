package com.kkini.core.domain.comment.service;

import com.kkini.core.domain.comment.dto.request.CommentRegisterRequestDto;
import com.kkini.core.domain.comment.entity.Comment;
import com.kkini.core.domain.comment.repository.CommentRepository;
import com.kkini.core.domain.member.entity.Member;
import com.kkini.core.domain.member.repository.MemberRepository;
import com.kkini.core.domain.post.entity.Post;
import com.kkini.core.domain.post.repository.PostRepository;
import com.kkini.core.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;

    @Override
    public void saveComment(CommentRegisterRequestDto dto, Long memberId) {
        Member writer = memberRepository.findById(memberId).orElseThrow(() -> new NotFoundException(Member.class, memberId));
        Post post = postRepository.findById(dto.getPostId()).orElseThrow(() -> new NotFoundException(Post.class, dto.getPostId()));
        Comment parents = null;

        if(dto.getParentsId() != null) {
            parents = commentRepository.findById(dto.getParentsId()).orElseThrow(() -> new NotFoundException(Comment.class, dto.getParentsId()));
        }

        commentRepository.save(Comment.builder()
                .member(writer)
                .post(post)
                .parents(parents)
                .contents(dto.getContents())
                .build()
        );
    }

}
